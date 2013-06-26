import unittest
from Graph.Graph import Graph


class DevTests(unittest.TestCase):

    def test_addAndDeleteTown(self):
        G = Graph()
        # delete a town from an empty graph
        with self.assertRaises(Exception) as context:
            G.deleteTown('1')
        self.assertEqual(context.exception.message, 'Town does not exist.')
        # add a town
        G.addTown('1')
        assert str(G) == 'Town: 1\n'
        # add another town
        G.addTown('2')
        assert str(G) == 'Town: 1\nTown: 2\n'
        # delete a town that has just been added
        G.deleteTown('2')
        assert str(G) == 'Town: 1\n'
        # delete a town which doesn't exist
        with self.assertRaises(Exception) as context:
            G.deleteTown('3')
        self.assertEqual(context.exception.message, 'Town does not exist.')
        # delete the last remaining town
        G.deleteTown('1')
        assert str(G) == ''

    def test_updateAndDeleteEdge(self):
        G = Graph()
        # add an edge
        G.addTown('1')
        G.addTown('2')
        G.updateEdge('1', '2', 3)
        assert str(G) == 'Town: 1\n      ->2 3\nTown: 2\n'
        # add another edge
        G.addTown('3')
        G.updateEdge('1', '3', 4)
        self.assertRegexpMatches(str(G), r'->2 3')
        self.assertRegexpMatches(str(G), r'->3 4')
        # update the first edge
        G.updateEdge('1', '2', 4)
        self.assertRegexpMatches(str(G), r'->2 4')
        # add an illegal edge
        with self.assertRaises(Exception) as context:
            G.updateEdge('4', '3', 2)
        self.assertEqual(context.exception.message, 'Origin does not exist.')
        # delete the first edge
        G.deleteEdge('1', '2')
        self.assertNotRegexpMatches(str(G), r'->2 4')
        # delete the Town 1 which is part of the only remaining edge
        G.deleteTown('1')
        self.assertNotRegexpMatches(str(G), r'->3 4')

if __name__ == '__main__':
    unittest.main()
